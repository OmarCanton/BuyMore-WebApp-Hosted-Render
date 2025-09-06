from dotenv import load_dotenv
import os
from fastapi import FastAPI
from pymongo import MongoClient
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()
load_dotenv()

# MongoDB connection

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
COLLECTION = os.getenv("COLLECTION")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
products_collection = db[COLLECTION]


# Function: Get ratings from MongoDB

def get_ratings_dataframe():
    ratings_data = []

    for product in products_collection.find():
        product_id = str(product["_id"])

        for comment in product.get("comments", []):
            user_id = str(comment.get("userId"))
            rating = comment.get("rating")

            if rating is not None:
                ratings_data.append({
                    "userId": user_id,
                    "productId": product_id,
                    "rating": float(rating)
                })

    if len(ratings_data) == 0:
        return pd.DataFrame(columns=["userId", "productId", "rating"])

    return pd.DataFrame(ratings_data)


# API route: Collaborative Filtering Recommendations

@app.get("/recommend/{user_id}")
def recommend(user_id: str, min_similarity: float = 0.2):
    """
    Generate collaborative filtering recommendations.
    :param user_id: target user
    :param min_similarity: minimum similarity threshold (default 0.2)
    """
    df = get_ratings_dataframe()

    # Case 1: No ratings at all
    if df.empty:
        return {"message": "No ratings available yet", "recommendations": []}

    # Case 2: User has not rated anything
    if user_id not in df["userId"].unique():
        return {"message": "User has not rated anything yet", "recommendations": []}

    # Create user-item rating matrix
    rating_matrix = df.pivot_table(
        index="userId", columns="productId", values="rating"
    ).fillna(0)

    # Check if target user exists in matrix
    if user_id not in rating_matrix.index:
        return {"message": "User has no ratings in matrix", "recommendations": []}

    # Compute cosine similarity between users
    similarity_matrix = cosine_similarity(rating_matrix)
    similarity_df = pd.DataFrame(
        similarity_matrix, index=rating_matrix.index, columns=rating_matrix.index
    )

    # Get similarity scores for this user
    user_similarity_scores = similarity_df.loc[user_id]

    # Find products user has already rated
    user_rated_products = set(df[df["userId"] == user_id]["productId"].unique())

    # Candidate products (from similar users)
    candidate_products = set(df["productId"].unique()) - user_rated_products

    if not candidate_products:
        return {"message": "No new products to recommend", "recommendations": []}

    # Score each candidate product based on weighted average of ratings
    recommendations = []
    for product in candidate_products:
        users_who_rated = df[df["productId"] == product]["userId"].unique()

        numerator, denominator = 0, 0
        for other_user in users_who_rated:
            similarity = user_similarity_scores.get(other_user, 0)

            # Only consider similar users above threshold
            if similarity < min_similarity:
                continue

            rating = rating_matrix.loc[other_user, product]
            numerator += similarity * rating
            denominator += similarity

        if denominator > 0:
            score = numerator / denominator
            recommendations.append({"productId": product, "score": round(score, 3)})

    if not recommendations:
        return {
            "message": f"No recommendations found (similar users below threshold {min_similarity})",
            "recommendations": []
        }

    # Sort recommendations by score
    recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)

    # Top 5
    top_5 = recommendations[:5]

    return {
        "user_id": user_id,
        "recommendations": top_5
    }






#1. Fault:: More Generalized instead of stricter CF based on score

# from dotenv import load_dotenv
# import os
# from fastapi import FastAPI
# from pymongo import MongoClient
# import pandas as pd

# app = FastAPI()
# load_dotenv()

# # =========================
# # MongoDB connection
# # =========================
# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")
# COLLECTION = os.getenv("COLLECTION")

# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]
# products_collection = db[COLLECTION]


# # =========================
# # Function: Get ratings from MongoDB
# # =========================
# def get_ratings_dataframe():
#     ratings_data = []

#     for product in products_collection.find():
#         product_id = str(product["_id"])

#         for comment in product.get("comments", []):
#             user_id = str(comment.get("userId"))
#             rating = comment.get("rating")

#             if rating is not None:
#                 ratings_data.append({
#                     "userId": user_id,
#                     "productId": product_id,
#                     "rating": float(rating)
#                 })

#     if len(ratings_data) == 0:
#         return pd.DataFrame(columns=["userId", "productId", "rating"])

#     return pd.DataFrame(ratings_data)


# # =========================
# # API route: Collaborative Filtering Recommendations
# # =========================
# @app.get("/recommend/{user_id}")
# def recommend(user_id: str):
#     df = get_ratings_dataframe()

#     # Case 1: No ratings at all
#     if df.empty:
#         return {"message": "No ratings available yet", "recommendations": []}

#     # Case 2: User has not rated anything
#     if user_id not in df["userId"].unique():
#         return {"message": "User has not rated anything yet", "recommendations": []}

#     # Get products this user has rated
#     user_ratings = df[df["userId"] == user_id]
#     user_products = set(user_ratings["productId"].unique())

#     # Find other users who rated the same products
#     similar_users = df[df["productId"].isin(user_products)]
#     similar_users = similar_users[similar_users["userId"] != user_id]

#     if similar_users.empty:
#         return {"message": "No similar users found, no recommendations", "recommendations": []}

#     # Get products those similar users have rated
#     similar_user_ids = similar_users["userId"].unique()
#     similar_users_ratings = df[df["userId"].isin(similar_user_ids)]

#     # Exclude products already rated by the target user
#     candidate_products = similar_users_ratings[~similar_users_ratings["productId"].isin(user_products)]

#     if candidate_products.empty:
#         return {"message": "No new products to recommend", "recommendations": []}

#     # Compute average ratings of candidate products from similar users
#     recommendations = (
#         candidate_products.groupby("productId")["rating"]
#         .mean()
#         .reset_index()
#         .sort_values(by="rating", ascending=False)
#     )

#     # Take top 5 recommendations
#     top_5 = recommendations.head(5).to_dict(orient="records")

#     print(top_5)

#     return {
#         "user_id": user_id,
#         "recommendations": top_5
#     }



#2.     Fault:: Generalized and Fake predictions exist because of SVD instead of stricter Collaborative filtering with no-overlaps

# @app.get("/recommend/{user_id}")
# def recommend(user_id: str):
#     df = get_ratings_dataframe()

#     if df.empty:
#         return {"message": "No ratings available yet", "recommendations": []}

#     if not (df['userId'] == user_id).any():
#         return {"message": "User has not rated anything yet", "recommendations": []}

#     # Only train if the user has ratings
#     reader = Reader(rating_scale=(1, 5))
#     data = Dataset.load_from_df(df[['userId', 'productId', 'rating']], reader)
#     trainset, _ = train_test_split(data, test_size=0.2)

#     model = SVD()
#     model.fit(trainset)

#     all_product_ids = df['productId'].unique()
#     predictions = []

#     for pid in all_product_ids:
#         if not ((df['userId'] == user_id) & (df['productId'] == pid)).any():
#             pred = model.predict(user_id, pid)
#             predictions.append((pid, pred.est))

#     predictions.sort(key=lambda x: x[1], reverse=True)
#     top_5 = predictions[:5]

#     return {"user_id": user_id, "recommendations": top_5}


#3.
#generalized one
# @app.get("/recommend/{user_id}")
# def recommend(user_id: str):
#     model, df = train_model()

#     if model is None:
#         return {"message": "No ratings available yet", "recommendations": []}

#     all_product_ids = df['productId'].unique()

#     predictions = []
#     for pid in all_product_ids:
#         if not ((df['userId'] == user_id) & (df['productId'] == pid)).any():
#             pred = model.predict(user_id, pid)
#             predictions.append((pid, pred.est))

#     predictions.sort(key=lambda x: x[1], reverse=True)

#     top_5 = predictions[:5]
#     return {"user_id": user_id, "recommendations": top_5}

from fastapi import FastAPI
from pymongo import MongoClient
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split

app = FastAPI()

# =========================
# MongoDB connection
# =========================
MONGO_URI = "mongodb+srv://buymoreapp24:sQIA3jiSZZw1XFoa@cluster0.w88yx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "test"
COLLECTION = "products"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
products_collection = db[COLLECTION]

# =========================
# Function: Get ratings from MongoDB
# =========================
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

# =========================
# Function: Train the model
# =========================
def train_model():
    df = get_ratings_dataframe()

    if df.empty:
        return None, None  # No ratings yet

    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df[['userId', 'productId', 'rating']], reader)
    trainset, _ = train_test_split(data, test_size=0.2)

    model = SVD()
    model.fit(trainset)

    return model, df

# =========================
# API route: Get recommendations for a user
# =========================
@app.get("/recommend/{user_id}")
def recommend(user_id: str):
    model, df = train_model()

    if model is None:
        return {"message": "No ratings available yet", "recommendations": []}

    all_product_ids = df['productId'].unique()

    predictions = []
    for pid in all_product_ids:
        if not ((df['userId'] == user_id) & (df['productId'] == pid)).any():
            pred = model.predict(user_id, pid)
            predictions.append((pid, pred.est))

    predictions.sort(key=lambda x: x[1], reverse=True)

    top_5 = predictions[:5]

    return {"user_id": user_id, "recommendations": top_5}

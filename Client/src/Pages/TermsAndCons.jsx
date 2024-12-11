import '../Styles/TermsAndCons.css'
import { useContext } from 'react'
import { themesContext } from '../Contexts/userDataContext'
import { ArrowBackIosRounded } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function TermsAndCons () {
    const {themeStyles} = useContext(themesContext)
    const navigate = useNavigate()

    return (
        <div 
            className="termsWrapper" 
            style={{backgroundColor: themeStyles.style.backgroundColor, color: themeStyles.style.color}}
        >
            <div className="termsHeader">
                <Button className='nav-back' onClick={() => navigate(-1)}>
                    <ArrowBackIosRounded style={{color: themeStyles.style.color}} fontSize='large' />
                </Button>
                <p>BuyMore WebApp &reg;</p>
            </div>
            <div className="terms-main">
                <span>Terms and Conditions</span>
                <p style={{color: 'grey'}}>Last updated: 21st November, 2024</p>

                <p>Welcome to BuyMore. These Terms and Conditions govern your use of our services. By accessing, browsing, or using our Service, you agree to comply with and be bound by these Terms and Conditions, including our Privacy Policy.</p>
                
                <p>If you do not agree to these Terms, please do not use our Service.</p>

                <span>1. Acceptance of Terms</span>
                <p>By using or accessing the Service, you agree to be bound by these Terms and Conditions and any additional terms and conditions or policies that are posted or updated from time to time. We reserve the right to update, modify, or change these Terms at any time, and such changes will be effective immediately upon posting. We encourage you to review these Terms regularly.</p>

                <span>2. Eligibility</span>
                <p>You must be at least 16 years old and capable of entering into a legally binding agreement to use our Service. By agreeing to these Terms, you represent that you meet the eligibility requirements.</p>

                <span>3. Account Registration</span>
                <p>To access certain features of our Service, you may be required to create an account with us. When you create an account, you agree to:</p>
                <ul>
                    <li>Provide accurate, current, and complete information during the registration process.</li>
                    <li>Maintain the confidentiality of your account login information (username and password).</li>
                    <li>Notify us immediately of any unauthorized use of your account or any security breach.</li>
                    <li>You are responsible for all activities that occur under your account.</li>
                </ul>

                <span>4. Product Information</span>
                <p>We strive to ensure that the products displayed on our website are described as accurately as possible. However, we do not guarantee the accuracy, completeness, or reliability of product descriptions, images, or other content. Colors, features, and specifications may vary depending on the device or platform used to view the website.</p>
                <p>We reserve the right to correct any errors, inaccuracies, or omissions and to change or update product information at any time without prior notice.</p>

                <span>5. Pricing and Payment</span>
                <p><strong>Prices:</strong> Prices for products are listed in the currency specified on the website. All prices are subject to change without notice. We may offer promotions or discounts from time to time.</p>
                <p><strong>Payment:</strong> You agree to pay the total amount specified at checkout, including any applicable taxes, shipping fees, and other charges. We accept payments through various methods, including credit cards, debit cards, and other electronic payment methods.</p>
                <p><strong>Taxes:</strong> The price of the products displayed includes applicable sales tax or VAT unless otherwise stated. You are responsible for any import duties, taxes, or fees associated with shipping to your location.</p>
                <p><strong>Payment Issues:</strong> If payment cannot be processed or if there are issues with your payment method, we may suspend or cancel your order.</p>

                <span>6. Order Confirmation and Cancellation</span>
                <p>After placing an order, you will receive an order confirmation email. This does not guarantee that your order will be processed or accepted. We reserve the right to cancel or refuse any order for reasons such as:</p>
                <ul>
                    <li>Product unavailability</li>
                    <li>Errors in product pricing or descriptions</li>
                    <li>Fraudulent or suspicious activity</li>
                </ul>
                <p>If your order is canceled after payment has been processed, we will issue a refund to the original payment method.</p>

                <span>7. Shipping and Delivery</span>
                <p>We aim to deliver products within the estimated delivery time, but we cannot guarantee specific delivery dates. Delivery times may vary based on location, carrier delays, and other unforeseen circumstances.</p>
                <ul>
                    <li><strong>Shipping Costs:</strong> Shipping fees will be calculated and displayed during checkout.</li>
                    <li><strong>Risk of Loss:</strong> Risk of loss or damage to products passes to you upon delivery.</li>
                </ul>

                <span>8. Returns and Refunds</span>
                <p>Our return and refund policy is outlined separately on our website. If you are not satisfied with your purchase, please review the return policy, as certain conditions, such as a time limit or product condition, may apply.</p>

                <span>9. Intellectual Property</span>
                <p>All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of the Company or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
                <p>You may not reproduce, distribute, modify, or create derivative works of any content on our site without prior written permission from us.</p>

                <span>10. User Conduct</span>
                <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not use our Service to:</p>
                <ul>
                    <li>Engage in any fraudulent or illegal activity</li>
                    <li>Post or transmit any harmful or abusive content</li>
                    <li>Violate the rights of others</li>
                    <li>Distribute viruses, malware, or other malicious software</li>
                    <li>Disrupt or interfere with the operation of the website</li>
                </ul>
                <p>We reserve the right to suspend or terminate your access to our Service if we suspect any violation of these Terms.</p>

                <span>11. Privacy Policy</span>
                <p>Your use of the Service is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our Service, you consent to the collection and use of your information as outlined in the Privacy Policy.</p>

                <span>12. Third-Party Links and Content</span>
                <p>Our website may contain links to third-party websites or services that are not controlled or operated by us. We do not endorse or assume responsibility for the content or practices of any third-party websites.</p>

                <span>13. Limitation of Liability</span>
                <p>To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill arising from your use of or inability to use the Service.</p>
                <p>In no event shall our total liability exceed the amount you paid for the product or service that gave rise to the claim.</p>

                <span>14. Indemnity</span>
                <p>You agree to indemnify and hold harmless the Company, its affiliates, employees, agents, and partners from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:</p>
                <ul>
                    <li>Your use of the Service</li>
                    <li>Your breach of these Terms</li>
                    <li>Your violation of any laws or third-party rights</li>
                </ul>

                <span>15. Force Majeure</span>
                <p>We are not responsible for any failure or delay in fulfilling our obligations under these Terms due to events beyond our control, including but not limited to natural disasters, acts of war, terrorism, strikes, or technical failures.</p>

                <span>16. Governing Law and Dispute Resolution</span>
                <p>These Terms shall be governed by and construed in accordance with the laws of the 1992 constitution of ghana. Any disputes arising from these Terms shall be resolved through binding arbitration in Ghana, unless otherwise specified by applicable law.</p>

                <span>17. Severability</span>
                <p>If any provision of these Terms is found to be unlawful, void, or unenforceable, the remaining provisions will remain in full force and effect.</p>

                <span>18. Entire Agreement</span>
                <p>These Terms, together with our Privacy Policy and any other legal notices posted on our website, constitute the entire agreement between you and the Company regarding your use of the Service.</p>

                <span>19. Contact Information</span>
                <p>If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
                <p>
                    <strong>Email: </strong><a style={{color: 'skyblue'}} href='mailto: buymoreapp24@gmail.com'>buymoreapp24@gmail.com</a>
                    <br/>
                    <strong>Phone: </strong>0536342775
                    <br /> 
                </p>
            </div>
        </div>
    )
}
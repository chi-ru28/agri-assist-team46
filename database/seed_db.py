import os
import sys
import uuid
from datetime import datetime, timedelta

# Add backend directory to path so we can import database models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

try:
    from database import SessionLocal, User, Farmer, Shop, Product, ChatHistory, Reminder, CropReport
    
    # Passwords are no longer used in the OTP-based flow
    # Salt and hashing logic removed

    db = SessionLocal()

    print("\n[START] Starting Database Seeding Process...")

    # 1. Create a dummy Farmer User
    farmer_email = "farmer@example.com"
    existing_farmer = db.query(User).filter(User.email == farmer_email).first()
    if not existing_farmer:
        print("[INFO] Creating dummy Farmer...")
        farmer_user = User(
            name="Ramesh Bhai (Demo)",
            phone="+919876543210",
            email=farmer_email,
            role="farmer"
        )
        db.add(farmer_user)
        db.commit()
        db.refresh(farmer_user)
        
        # Add Farmer details
        farmer_details = Farmer(
            userId=farmer_user.id,
            landSize=5.5,
            address="Village: Ranuj, Patan, Gujarat",
            location={"type": "Point", "coordinates": [72.1, 23.8]}
        )
        db.add(farmer_details)
        
        # Add a Chat History for the farmer
        chat = ChatHistory(
            userId=farmer_user.id,
            messages=[
                {"role": "user", "content": "My wheat crop is turning yellow. What should I do?", "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat()},
                {"role": "assistant", "content": "Yellowing of wheat (Chlorosis) often indicates nitrogen deficiency or overwatering. Apply 25kg Urea per acre and ensure proper drainage.", "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat()}
            ]
        )
        db.add(chat)

        # Add a Reminder
        reminder = Reminder(
            userId=farmer_user.id,
            title="Apply Urea Fertilizer",
            description="Apply 25kg Urea to the wheat field as suggested by AgriAssist.",
            remindAt=datetime.utcnow() + timedelta(days=2)
        )
        db.add(reminder)

        # Add a Crop Report
        report = CropReport(
            userId=farmer_user.id,
            cropName="Wheat",
            analysisResult="Mild Nitrogen Deficiency Detected.",
            recommendation={"fertilizer": "Urea", "dosage": "25kg/acre"}
        )
        db.add(report)
        db.commit()

    # 2. Create a dummy Shopkeeper User
    shop_email = "shop@example.com"
    existing_shop = db.query(User).filter(User.email == shop_email).first()
    if not existing_shop:
        print("[INFO] Creating dummy Shopkeeper...")
        shop_user = User(
            name="Agri Inputs Center",
            phone="+919876543211",
            email=shop_email,
            role="shopkeeper"
        )
        db.add(shop_user)
        db.commit()
        db.refresh(shop_user)
        
        # Add Shop details
        shop_details = Shop(
            userId=shop_user.id,
            shopName="Kisan Agri Store",
            address="Main Bazaar, Patan",
            location={"type": "Point", "coordinates": [72.12, 23.83]}
        )
        db.add(shop_details)
        db.commit()
        db.refresh(shop_details)

        # Add Products to the Shop
        print("[INFO] Adding demo products...")
        p1 = Product(shopId=shop_details.id, name="IFFCO Urea", category="Fertilizer", price=266.0, inventoryCount=50, tag="Chemical")
        p2 = Product(shopId=shop_details.id, name="Organic Neem Cake", category="Fertilizer", price=450.0, inventoryCount=20, tag="Organic")
        p3 = Product(shopId=shop_details.id, name="Tractor Spray Pump", category="Tool", price=1200.0, inventoryCount=5, tag="Tool")
        db.add_all([p1, p2, p3])
        db.commit()

    print("[SUCCESS] Database successfully seeded with dummy data for all tables!")
    print("\n--- You can now run 'python view_data.py' to see the newly created data! ---")

except Exception as e:
    import traceback
    print(f"[ERROR] Error seeding database: {e}")
    with open("seed_error.txt", "w") as f:
        f.write(traceback.format_exc())
    print("Full error traceback written to seed_error.txt")
    try:
        db.rollback()
    except:
        pass
finally:
    try:
        db.close()
    except:
        pass

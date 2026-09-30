from sqlalchemy import create_engine, text
from database.seed_data import run_seed

DATABASE_URL = "mysql+pymysql://root:@localhost:3306/nhahang"
engine = create_engine(DATABASE_URL)

try:
    run_seed(engine)
except Exception as e:
    print("Seed data note:", e)

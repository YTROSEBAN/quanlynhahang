from sqlalchemy import create_engine, text

DATABASE_URL = "mysql+pymysql://root:@localhost:3306/quanlynhahang"
engine = create_engine(DATABASE_URL)

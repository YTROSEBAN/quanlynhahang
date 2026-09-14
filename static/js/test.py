print ("hello world")
bien_a=1
bien_b=2
bien_c="nguyen van a"
bien_d=12.5
bien_e= False
ten =input("nhap ten bn a:")
# ham (function)
#khai ba ham
def hello():
    print("xin chao")
def tinhtong(a,b):
    print(a+b)
    tinhtong(1,2)
#danhsach(list)
#0
#trai_cay=["tao,le,cam.quyt"]
trai_cay="tao,le,cam,quyt"
#split(",")chuyen chuoi thanh mang
print(trai_cay.split(","))
for x in  trai_cay.split(","):
    print(x.strip()) #strip xoa khoang trang
    #bai tap nhap 2 so a,b tu ban phim dung ham input,tinh tong v in ra so la l so chan ,input 1,2 output 3,2
a = int(input())
b = int(input())

tong = a + b

dem_chan = 0
if a % 2 == 0:
    dem_chan += 1
if b % 2 == 0:
    dem_chan += 1

print(tong, dem_chan, sep=",")
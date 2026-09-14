a = int(input("Nhap a: "))
b = int(input("Nhap b: "))

tong = a + b

if a % 2 == 0:
    print(a, "la so chan")
else:
    print(a, "la so le")

if b % 2 == 0:
    print(b, "la so chan")
else:
    print(b, "la so le")

print("Tong =", tong)
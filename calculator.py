# 電卓アプリケーション

# 足し算
def add(x, y):
    return x + y

# 引き算
def subtract(x, y):
    return x - y

# 掛け算
def multiply(x, y):
    return x * y

# 割り算
def divide(x, y):
    if y == 0:
        return "ゼロで割ることはできません"
    return x / y

# ユーザー入力を受け取る
def calculator():
    print("選択してください：")
    print("1. 足し算")
    print("2. 引き算")
    print("3. 掛け算")
    print("4. 割り算")

    choice = input("選択（1/2/3/4）：")

    num1 = float(input("最初の数を入力してください："))
    num2 = float(input("次の数を入力してください："))

    if choice == '1':
        print(f"結果： {num1} + {num2} = {add(num1, num2)}")
    elif choice == '2':
        print(f"結果： {num1} - {num2} = {subtract(num1, num2)}")
    elif choice == '3':
        print(f"結果： {num1} * {num2} = {multiply(num1, num2)}")
    elif choice == '4':
        print(f"結果： {num1} / {num2} = {divide(num1, num2)}")
    else:
        print("無効な選択です")

# プログラム実行
calculator()

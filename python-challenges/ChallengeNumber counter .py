def by_sing(which, nums):
    if which not in ("positive", "negative", "zero"):
        return -1

    result = 0
    for num in nums:
        if which == "positive" and num > 0:
            result += 1
        elif which == "negative" and num < 0:
            result += 1
        elif which == "zero" and num == 0:
            result += 1
    return result


print(by_sing("positive", [0, -1, 3, 5, -7, 2, 0]))
print(by_sing("negative", [10, -2, -5, 4, 0, -1]))
print(by_sing("zero", [0, 0, 1, -1, 2]))
print(by_sing("pos", [1, 2, 3]))

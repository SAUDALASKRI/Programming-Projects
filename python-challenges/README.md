# ChallengeNumber Counter 🧮

This is a simple Python challenge project that counts **positive**, **negative**, and **zero** numbers from a given list.

---

## 🧠 Description
The program defines a function `by_sing(which, nums)` that:
- Takes two parameters:
  - `which`: the type of numbers to count (`"positive"`, `"negative"`, or `"zero"`).
  - `nums`: a list of integers.
- Returns the count of numbers matching the specified category.

If the user provides an invalid value for `which`, the function returns `-1`.

---

## 🧩 Example

```python
print(by_sing("positive", [0, -1, 3, 5, -7, 2, 0]))  # Output: 3
print(by_sing("negative", [10, -2, -5, 4, 0, -1]))   # Output: 3
print(by_sing("zero", [0, 0, 1, -1, 2]))             # Output: 2
print(by_sing("pos", [1, 2, 3]))                     # Output: -1

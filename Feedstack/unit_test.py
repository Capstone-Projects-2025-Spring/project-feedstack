import pytest
from numbers_test import add_numbers


# Test function to check the addition of two numbers
def test_add_numbers():
    assert add_numbers(2, 3) == 5          # Test 1: Should return 5
    assert add_numbers(1, 1) == 2          # Test 2: Should return 2
    assert add_numbers(0, 0) == 0          # Test 3: Should return 0
    assert add_numbers(-1, 1) == 0         # Test 4: Should return 0
    assert add_numbers(-2, -3) == -5       # Test 5: Should return -5


# To run the tests, run: pytest unit_test.py

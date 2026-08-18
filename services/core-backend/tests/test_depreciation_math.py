import pytest
from app.core.tasks.depreciation import calculate_straight_line, calculate_double_declining

def test_straight_line_depreciation_math():
    """
    Tests numerical precision of straight-line depreciation formula.
    Purchase: 12000, Salvage: 2000, Life: 5 years
    Yearly Depr = (12000 - 2000) / 5 = 2000
    Weekly Depr = 2000 / 52 = 38.461538...
    """
    weekly = calculate_straight_line(acquisition_cost=12000.0, salvage_value=2000.0, useful_life_years=5)
    
    # Assert precisely
    assert round(weekly, 2) == 38.46
    
    # Negative/Zero bounds
    assert calculate_straight_line(12000.0, 2000.0, 0) == 0.0

def test_double_declining_depreciation_math():
    """
    Tests double-declining balance math.
    Book Value: 10000, Life: 5 years
    Straight rate: 1/5 = 20%
    Double rate: 40%
    Yearly Depr = 10000 * 0.40 = 4000
    Weekly Depr = 4000 / 52 = 76.923076...
    """
    weekly = calculate_double_declining(current_book_value=10000.0, useful_life_years=5)
    
    assert round(weekly, 2) == 76.92
    
    # Negative/Zero bounds
    assert calculate_double_declining(10000.0, 0) == 0.0

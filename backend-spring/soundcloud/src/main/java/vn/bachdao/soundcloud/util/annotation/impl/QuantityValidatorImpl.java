package vn.bachdao.soundcloud.util.annotation.impl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.bachdao.soundcloud.util.annotation.QuantityValidator;

public class QuantityValidatorImpl implements ConstraintValidator<QuantityValidator, Integer> {

    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        return value == null || value == 1 || value == -1;
    }
}

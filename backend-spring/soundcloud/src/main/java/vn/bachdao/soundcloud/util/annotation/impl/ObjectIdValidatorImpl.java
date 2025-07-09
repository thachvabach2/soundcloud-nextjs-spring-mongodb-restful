package vn.bachdao.soundcloud.util.annotation.impl;

import org.bson.types.ObjectId;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;

public class ObjectIdValidatorImpl implements ConstraintValidator<ObjectIdValidator, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext arg1) {
        return value == null || ObjectId.isValid(value);
    }

}

package vn.bachdao.soundcloud.util.annotation.impl;

import java.util.Set;

import org.bson.types.ObjectId;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;

public class ObjectIdListValidatorImpl implements ConstraintValidator<ObjectIdValidator, Set<String>> {

    @Override
    public boolean isValid(Set<String> values, ConstraintValidatorContext context) {
        if (values == null || values.isEmpty()) {
            return true;
        }

        for (String value : values) {
            if (value == null) {
                // Null item in list
                addViolation(context, "List contains null ObjectId");
                return false;
            }

            if (value.trim().isEmpty()) {
                // Empty string item in list
                addViolation(context, "List contains empty ObjectId");
                return false;
            }

            if (!ObjectId.isValid(value)) {
                // Invalid ObjectId format
                addViolation(context, "Invalid ObjectId format: " + value);
                return false;
            }
        }

        return true;
    }

    private void addViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }

}

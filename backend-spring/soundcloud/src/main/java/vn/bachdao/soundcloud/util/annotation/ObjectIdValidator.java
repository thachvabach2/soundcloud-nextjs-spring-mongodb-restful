package vn.bachdao.soundcloud.util.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.bachdao.soundcloud.util.annotation.impl.ObjectIdValidatorImpl;

@Documented
@Constraint(validatedBy = { ObjectIdValidatorImpl.class })
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ObjectIdValidator {
    String message() default "{vn.bachdao.soundcloud.util.annotation.ValidObjectId.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
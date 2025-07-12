package vn.bachdao.soundcloud.util.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import vn.bachdao.soundcloud.util.annotation.impl.QuantityValidatorImpl;

@Documented
@Constraint(validatedBy = { QuantityValidatorImpl.class })
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface QuantityValidator {
    String message() default "{vn.bachdao.soundcloud.util.annotation.QuantityValidator.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

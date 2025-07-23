package vn.bachdao.soundcloud.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ApiDelayInterceptor implements HandlerInterceptor {
    @Value("${soundcloud.delay-timeout}")
    private long delayTimeout;

    private static final Logger LOG = LoggerFactory.getLogger(ApiDelayInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        if (delayTimeout > 0) {
            LOG.info("Adding delay of {}ms for request: {}", delayTimeout, request.getRequestURI());

            try {
                Thread.sleep(delayTimeout);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                LOG.warn("Delay interrupted for request: {}", request.getRequestURI());
                return false;
            }
        }

        return true;
    }
}

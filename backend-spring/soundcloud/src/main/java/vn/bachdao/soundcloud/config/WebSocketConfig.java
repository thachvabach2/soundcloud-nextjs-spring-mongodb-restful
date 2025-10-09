package vn.bachdao.soundcloud.config;

import java.security.Principal;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final SecurityUtils securityUtils;

    public WebSocketConfig(SecurityUtils securityUtils) {
        this.securityUtils = securityUtils;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/notification") // connection establishment
                // .setAllowedOrigins("http://localhost:3000",
                // "http://171.227.196.104:3000", "http://171.227.196.104",
                // "http://discoverserver.devtaycode.click:3000",
                // "http://discoverserver.devtaycode.click")
                .setAllowedOrigins("*")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message,
                        StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Lấy JWT từ header custom
                    String token = accessor.getFirstNativeHeader("Authorization");
                    if (token != null && token.startsWith("Bearer ")) {
                        token = token.substring(7);

                        // Parse JWT lấy userId
                        Jwt decodedToken = null;
                        try {
                            decodedToken = securityUtils.checkValidRefreshToken(token);
                        } catch (UserNotAuthenticatedException e) {
                            e.printStackTrace();
                        }
                        String userId = decodedToken.getSubject();

                        // Gắn Principal
                        Principal principal = () -> userId;
                        accessor.setUser(principal);
                    }

                }
                return message;
            }
        });
    }
}

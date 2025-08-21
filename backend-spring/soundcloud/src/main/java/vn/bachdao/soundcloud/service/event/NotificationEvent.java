package vn.bachdao.soundcloud.service.event;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

@Getter
public class NotificationEvent extends ApplicationEvent {

    private final String type; // COMMENT, LIKE, FOLLOW, REPOST
    private final String fromUserId;
    private final String toUserId;
    private final String entityId;

    public NotificationEvent(
            Object source,
            String type,
            String fromUserId,
            String toUserId,
            String entityId) {
        super(source);
        this.type = type;
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.entityId = entityId;
    }
}

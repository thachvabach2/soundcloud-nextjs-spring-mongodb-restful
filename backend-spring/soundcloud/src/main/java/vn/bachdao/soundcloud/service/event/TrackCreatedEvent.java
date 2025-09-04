package vn.bachdao.soundcloud.service.event;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;

@Getter
public class TrackCreatedEvent extends ApplicationEvent {
    private final String trackId;

    public TrackCreatedEvent(Object source, String trackId) {
        super(source);
        this.trackId = trackId;
    }
}

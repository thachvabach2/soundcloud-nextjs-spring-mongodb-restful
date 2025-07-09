package vn.bachdao.soundcloud.domain.listener;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import vn.bachdao.soundcloud.domain.Comment;

@Component
public class CommentMongoEventListener extends AbstractMongoEventListener<Comment> {
    private MongoOperations mongoOperations;

    public CommentMongoEventListener(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    @Override
    public void onBeforeSave(BeforeSaveEvent<Comment> event) {
        Comment comment = event.getSource();
        Document document = event.getDocument();
        String collection = event.getCollectionName();

        boolean isNew = comment.getId() == null || !mongoOperations.exists(
                Query.query(Criteria.where("_id").is(comment.getId())),
                Comment.class,
                collection);

        if (isNew) {
            comment.setIsDeleted(false);
            document.put("isDeleted", comment.getIsDeleted());
        }
    }
}

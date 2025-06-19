package vn.bachdao.soundcloud.domain.listener;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeSaveEvent;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import vn.bachdao.soundcloud.domain.User;

@Component
public class UserMongoEventListener extends AbstractMongoEventListener<User> {

    private MongoOperations mongoOperations;

    public UserMongoEventListener(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    @Override
    public void onBeforeSave(BeforeSaveEvent<User> event) {
        User user = event.getSource();
        Document document = event.getDocument();
        String collection = event.getCollectionName();

        boolean isNew = user.getId() == null || !mongoOperations.exists(
                Query.query(Criteria.where("_id").is(user.getId())),
                User.class,
                collection);

        if (isNew) {
            user.setIsVerify(true);
            document.put("isVerify", user.getIsVerify());
        }
    }
}

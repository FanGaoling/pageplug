package com.appsmith.server.helpers;

import com.appsmith.server.domains.Comment;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class CommentUtilsTest {
    @Test
    void getCommentBody_WhenBodyIsNull_ReturnsEmptyList() {
        Comment comment = new Comment();
        Assert.assertEquals(0, CommentUtils.getCommentBody(comment).size());
    }

    @Test
    void getCommentBody_WhenBodyHasMultipleBlocks_ReturnsValidBodies() {
        Comment.Block commentBlock1 = new Comment.Block();
        commentBlock1.setText("First line");
        Comment.Block commentBlock2 = new Comment.Block();
        commentBlock1.setText("Second line");

        Comment.Body commentBody = new Comment.Body();
        commentBody.setBlocks(List.of(commentBlock1, commentBlock2));

        Comment comment = new Comment();
        comment.setBody(commentBody);

        assertThat(CommentUtils.getCommentBody(comment).size()).isEqualTo(2);
        assertThat(CommentUtils.getCommentBody(comment).get(0)).isEqualTo(commentBlock1.getText());
        assertThat(CommentUtils.getCommentBody(comment).get(1)).isEqualTo(commentBlock2.getText());
    }

    @Test
    public void isUserMentioned_WhenBodyIsNull_ReturnsFalse() {
        Comment comment = new Comment();
        Assert.assertFalse(CommentUtils.isUserMentioned(comment, "user@abc.com"));
    }

    @Test
    public void isUserMentioned_WhenBodyHasNoMention_ReturnsFalse() {
        Comment.Body body = new Comment.Body();
        Comment comment = new Comment();
        comment.setBody(body);
        Assert.assertFalse(CommentUtils.isUserMentioned(comment, "user@abc.com"));

        Comment.Entity entity = new Comment.Entity();
        Map<String, Comment.Entity> entityMap = new HashMap<>();
        entityMap.put("abc", entity);
        body.setEntityMap(entityMap);
        comment.setBody(body);
        Assert.assertFalse(CommentUtils.isUserMentioned(comment, "user@abc.com"));
    }

    private Map<String, Comment.Entity> createEntityMapForUsers(List<String> mentionedUserNames) {
        Map<String, Comment.Entity> entityMap = new HashMap<>();
        for (String username: mentionedUserNames) {
            Comment.EntityData.EntityUser entityUser = new Comment.EntityData.EntityUser();
            entityUser.setUsername(username);
            Comment.EntityData.Mention mention = new Comment.EntityData.Mention();
            mention.setUser(entityUser);

            Comment.EntityData entityData = new Comment.EntityData();
            entityData.setMention(mention);

            Comment.Entity entity = new Comment.Entity();
            entity.setType("mention");
            entity.setData(entityData);
            entityMap.put(username, entity);
        }
        return entityMap;
    }

    @Test
    public void isUserMentioned_WhenSomeoneIsMentioned_ReturnsCorrectValue() {
        Map<String, Comment.Entity> entityMap = createEntityMapForUsers(
                List.of("1", "2", "3")
        );
        Comment.Body body = new Comment.Body();
        body.setEntityMap(entityMap);
        Comment comment = new Comment();
        comment.setBody(body);

        Assert.assertTrue(CommentUtils.isUserMentioned(comment, "1"));
        Assert.assertTrue(CommentUtils.isUserMentioned(comment, "2"));
        Assert.assertTrue(CommentUtils.isUserMentioned(comment, "3"));
        Assert.assertFalse(CommentUtils.isUserMentioned(comment, "4"));
    }

    @Test
    public void getSubscriberUsernames_WhenNoMention_ContainsAuthorOnly() {
        Comment comment = new Comment();
        comment.setAuthorUsername("abc");

        Set<String> subscriberUsernames = CommentUtils.getSubscriberUsernames(comment);
        assertThat(subscriberUsernames.size()).isEqualTo(1);
        assertThat(subscriberUsernames).contains("abc");
    }

    @Test
    public void getSubscriberUsernames_WhenMentionExists_ContainsAuthorAndMentions() {
        Map<String, Comment.Entity> entityMap = createEntityMapForUsers(
                List.of("1", "2", "3")
        );
        Comment.Body body = new Comment.Body();
        body.setEntityMap(entityMap);
        Comment comment = new Comment();
        comment.setBody(body);
        comment.setAuthorUsername("abc");

        Set<String> subscriberUsernames = CommentUtils.getSubscriberUsernames(comment);
        assertThat(subscriberUsernames.size()).isEqualTo(4);
        assertThat(subscriberUsernames).contains("abc");
        assertThat(subscriberUsernames).contains("1");
        assertThat(subscriberUsernames).contains("2");
        assertThat(subscriberUsernames).contains("3");
    }
}
package com.calendar.CalendarApp.Controller;


import com.calendar.CalendarApp.Model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    // Handles messages from /app/hello. (Note the Spring adds the /app prefix for us).
    @MessageMapping("/chat.send")
    // Sends the return value of this method to /topic/messages
    @SendTo("/topic/messages")
    public Message message(Message message){

        return  new Message(message.getName(),message.getMessage(),message.getType(),"");
    }


    @MessageMapping("/chat.register")
    @SendTo("/topic/messages")
    public Message register(@Payload Message message, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message.getName());
        headerAccessor.setSessionId("omaritooooo");
        System.out.println(headerAccessor);
        return message;
    }
}

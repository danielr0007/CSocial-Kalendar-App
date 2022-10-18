package com.calendar.CalendarApp.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private String name;
    private String message;
    private MessageType type;
    private String color;

    public enum MessageType {
        CHAT, LEAVE, JOIN
    }

}

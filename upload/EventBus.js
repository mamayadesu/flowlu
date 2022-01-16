class EventBus
{
    constructor()
    {
        this.channels = {};
    }
    
    subscribe(channelName, callback)
    {
        if (typeof channelName != "string" || typeof callback != "function")
        {
            throw new Error("EventBus.subscribe принимает следующие значения: channelName (string), callback (function)");
        }
        
        if (typeof this.channels[channelName] == "undefined")
        {
            this.channels[channelName] = {};
        }
        
        var id = Object.keys(this.channels[channelName]).length;
        
        this.channels[channelName][id] = callback;
        
        return id;
    }
    
    publisher(channelName, ...args)
    {
        if (typeof channelName != "string")
        {
            throw new Error("EventBus.publisher принимает следующие значения: channelName (string), ...args");
        }
        
        if (typeof this.channels[channelName] == "undefined")
        {
            throw new Error("Канал `" + channelName + "` не существует");
        }
        
        for (var key in this.channels[channelName])
        {
            if (this.channels[channelName][key] != null)
            {
                this.channels[channelName][key](...args);
            }
        }
    }
    
    unsubscribe(channelName, subscriptionId)
    {
        if (typeof channelName != "string" || typeof subscriptionId != "number")
        {
            throw new Error("EventBus.unsubscribe принимает следующие значения: channelName (string), subscriptionId (number)");
        }
        
        if (typeof this.channels[channelName] == "undefined")
        {
            throw new Error("Канал `" + channelName + "` не существует");
        }
        
        this.channels[channelName][subscriptionId] = null;
    }
}
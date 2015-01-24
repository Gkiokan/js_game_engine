/*
 * Project: JS Game Engine | Javascript Game Engine
 * Author: Gkiokan Sali
 * URL: www.gkiokan.net/project/js-game-engine
 * Date: 21.12.2014
 * License: ???
 * Comments: first prototype v.0.0.1
 */

jsGameEngine = {
    version : 'JSGE v0.0.1 | Prototype | Gkiokan.NET',
    author: 'Gkiokan Sali',
    author_url : 'www.gkiokan.net/project/js-game-engine',
    
    game : '',
    user : {},
    fps : 60,
    fps_average : 0,
    fps_view : ".modify input[name=fps]",
    fps_view_timer : ".modify input[name=fps_timer]",
    fps_view_count : ".modify input[name=fps_count]",
    players : [],
    player_count: 0,
    timer_id : '',
    timer_view : '.timer',
    timer_count : 0,
    timer_tick : 0,
    fires: [],
    fire_count: 0,
    fire_view  : ".modify input[name=fire_count]",
    
    init: function(engine){
        this.game = engine;
        this.playerModel = playerModel;
        debug.add(this.version);        
    },
    
    player : function(name, type, level, user, x, y){
        if (name.length>3-1 && type.length>1 && level.length>0) {
            playerModel.player(name, type, level, user, x, y);
        } else { debug.error("Player Input Data korrupt or has Errors"); }        
    },
    
    build_players: function(a){
        $(this.players).each(function(e){
            playerModel.spawn(e);
        });
    },
    
    build_player: function(name, type, level, user, x, y){
        if (name.length>3-1 && type.length>1 && level.length>0) {
            playerModel.spawn(playerModel.player(name, type, level, user, x, y));
        } else { debug.error("Can't Build Player because Data are korrupt or has Errors"); }
    },
    
    start: function(){
        var log = "JSGE starting engine";
        console.log(log); debug.add(log);
        
        this.build_players();
        this.playerModel.find_user();
        this.playerModel.player_online();
        this.timer();
        Key.init();        
        
        jsGameEngine.calculate_fps();
    },
    
    timer : function(b){
        if (this.timer_id=='') {
            jsGameEngine.timer_id = setInterval(function(){
                $(jsGameEngine.timer_view).animate({'width':'100%'}, 1000 / this.fps);                
                $(jsGameEngine.fps_view_timer).val(jsGameEngine.timer_count);
                jsGameEngine.playerModel.player_online();
                Key.hook();
                //fireModel.animation();
                
                jsGameEngine.timer_count +=1;
                //if(jsGameEngine.timer_count>1) jsGameEngine.timer();                
            }, 1000 / this.fps);
        } else {
            clearInterval(jsGameEngine.timer_id);
            $(jsGameEngine.timer_view).animate({'width':'0px'}, 1000 / this.fps);
            jsGameEngine.timer_id='';
            jsGameEngine.timer();
        }        
    },
    
    calculate_fps : function(a){
        setInterval(function(a){
            jsGameEngine.fps_average = jsGameEngine.timer_count / jsGameEngine.timer_tick;
            
            $(jsGameEngine.fire_view).val(jsGameEngine.fire_count);
            $(jsGameEngine.fps_view_timer).val(jsGameEngine.timer_count);
            $(jsGameEngine.fps_view_count).val(jsGameEngine.timer_tick);
            $(jsGameEngine.fps_view).val(jsGameEngine.fps_average);
            jsGameEngine.timer_tick++;
        }, 1000);
        return jsGameEngine.fps_average;    
    },
    
}

fireModel = {
    model : { i: null, from: null,  user: null,  damage: '', skill:'',  fired: '', level:'', x:0, y:0 },
    map : '.map .fires',
    view : function(info){ return "<div class='fire skill_1' data-fire-id='"+info.fired+"' style='top:"+info.y+"px; left:"+info.x+"px'></div>"; },
    
    fire: function(i){
        model = this.model;
        model.fired = +new Date;
        model.from = jsGameEngine.players[i];
        
        model.x = parseInt(jsGameEngine.user.x)+100;
        model.y = parseInt(jsGameEngine.user.y)+50;
        
        jsGameEngine.fire_count++;        
        jsGameEngine.fires.push(model);
        $(this.map).append(this.view(model));
        this.animation_solo(model);
    },
    
    animation : function(){        
        $(jsGameEngine.fires).each(function(f){
            console.log(f);
            var fire = $('.fire[data-fire-id='+model.fired+']');
            var fire_x = fire.css('left');
            fire.animate({'left':parseInt(fire_x)+2});
        });
    },
    
    animation_solo : function(model){
        var fire = $('.fire[data-fire-id='+model.fired+']');
        fireModel.animation_action(fire, model);
    },
    
    animation_action: function(fire, model){
        var fire_step = 500;
        if (jsGameEngine.user.lastDirection=='left') {
            fire.css({'left': parseInt(fire.css('left'))-110+'px'});
            fire_step *=-1;
        }
        var fire_x = parseInt(fire.css('left'))+fire_step;
        var fire_y = parseInt(fire.css('top'))+fire_step;
        $(fire).animate({'left': fire_x+'px'}, 700, 'linear', function(){ $(this).fadeOut(300); });
        
        /*
        $(fire).animate({'left': fire_x+'px'}, {
                                                duration:700,
                                                easing : 'linear',
                                                step: function(b){ debug.info(b); },
                                                complete: function(){ $(this).fadeOut(300); }
                                                });*/
    }
    
}

/*
 * PLAYER MODEL
 */
playerModel = {
    players_view : ".players",
    player_online_view : ".player_online",
    
    template : function(id){
        player = jsGameEngine.players[id];
        if (!player) { alert("NO Player!"); }
        id = player.id;
        name = player.name;    
        type = player.type;
        level = player.level;
        x = player.x; y = player.y;
        user_class = player.user==true ? 'user' : '';
        return "<div class='player "+user_class+"' id='player_"+id+"' data-username='"+name+"' data-level='"+level+"' data-class='"+type+"' data-x='"+x+"' data-y='"+y+"' style='top:"+y+"px; left:"+x+"px'><div class='name'>"+name+"</div></div>";
    },
    
    template_player_online : function(id){
        player = jsGameEngine.players[id];
        if (!player) { alert("NO Player!"); }
        id = player.id;
        name = player.name;    
        type = player.type;
        level = player.level;
        x = player.x; y = player.y;
        return "<div class='player_list_element'><div class='on'></div> "+name+" <small>["+x+" | "+y+"]</small></div>";  
    },
    
    player : function(name, type, level, user, x, y){
        var player = {};
        player.name = name;
        player.id = jsGameEngine.player_count;
        player.type = type;
        player.level = level;
        player.user = user;
        player.x = x ? x : 0;
        player.y = y ? y : 0;
        
        if (user==true) { jsGameEngine.user = player; }
        jsGameEngine.players.push(player);
        jsGameEngine.player_count+=1;
   
        debug.success("Player "+name+" has been added");
        return player.id;        
    },
    
    spawn: function(e){
        $(this.players_view).append(playerModel.template(e));
    },
    
    find_user : function(){
        user = jsGameEngine.user;
        if (user.user) { debug.info("User "+user.name+" has been found"); hud.set(); }
        else { debug.error("No user has been found"); }
    },

    player_online : function(){
        $(this.player_online_view).html(' ');
        $(jsGameEngine.players).each(function(p){
            $(playerModel.player_online_view).append(playerModel.template_player_online(p));    
        });
    },
    
}

/*
 * KEYBOARD
 */
var Key = {
    _pressed: {},
    step: 20,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    S: 83,
    D: 68,
    
    user: jsGameEngine.user,
    
    isDown: function(keyCode) { return this._pressed[keyCode]; },    
    onKeydown: function(event) { this._pressed[event.keyCode] = true; },    
    onKeyup: function(event) { delete this._pressed[event.keyCode]; },
    
    init: function(){
        window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
        window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);    
    },
    
    hook: function(k){
        if (Key.isDown(Key.UP)) this.moveUp();
        if (Key.isDown(Key.LEFT)) this.moveLeft();
        if (Key.isDown(Key.DOWN)) this.moveDown();
        if (Key.isDown(Key.RIGHT)) this.moveRight();
        
        if (Key.isDown(Key.S)) this.createFire(); 
    },
    
    pos: function(x){
        return $("#player_"+jsGameEngine.user.id).attr('data-'+x);
    },
    
    p: function(){
        return $("#player_"+jsGameEngine.user.id);
    },
    
    moveUp: function(){ jsGameEngine.user.y = parseInt(jsGameEngine.user.y)-this.step; this.p().css({'top': jsGameEngine.user.y+"px"}); },
    moveLeft: function(){ jsGameEngine.user.x = parseInt(jsGameEngine.user.x)-this.step; this.p().css({'left': jsGameEngine.user.x+"px"}); jsGameEngine.user.lastDirection='left'; },
    moveDown: function(){ jsGameEngine.user.y = parseInt(jsGameEngine.user.y)+this.step; this.p().css({'top': jsGameEngine.user.y+"px"}); },
    moveRight: function(){ jsGameEngine.user.x =parseInt(jsGameEngine.user.x)+this.step; this.p().css({'left': jsGameEngine.user.x+"px"}); jsGameEngine.user.lastDirection='right'; },
    
    createFire: function(){
        fireModel.fire(jsGameEngine.user.id);
    }
};


/*
 * HUD
 */
hud = {
    hud_user : '.hud .user',
    set: function(){
        user = jsGameEngine.user;
        $(this.hud_user).children('.name').html(user.name);
        $(this.hud_user).children('.level').html(user.level);
        $(this.hud_user).children('.type').html(user.type);
    }
}



/*
 * DEBUG FUNCTION
 */
debug = {
    debug : '.debug',
    
    add : function(e){
        $(this.debug).append("<div>"+e+"</div>");        
    },
    
    error : function(e){ debug.add("<div class='error'>"+e+"</div>"); },
    success: function(e){ debug.add("<div class='success'>"+e+"</div>"); },
    info: function(e){ debug.add("<div class='info'>"+e+"</div>"); }
}  
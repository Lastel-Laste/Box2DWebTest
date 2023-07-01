// 2D.js

var world;
      
function init() {
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
    ,	  b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	  b2Body = Box2D.Dynamics.b2Body
    ,	  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	  b2Fixture = Box2D.Dynamics.b2Fixture
    ,	  b2World = Box2D.Dynamics.b2World
    ,	  b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	  b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,     canvas = document.getElementById("canvas")
    ,     ctx = canvas.getContext("2d")
    ;
    
    world = new b2World(
        new b2Vec2(0, 100)    //gravity
    ,  true                 //allow sleep
    );
    
    var fixDef  = new b2FixtureDef
    ,   bodyDef = new b2BodyDef
    ;bodyDef.type = b2Body.b2_staticBody;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    
    var groundWidth = window.innerWidth
    ,   groundHeight = window.innerHeight;

    createWall(groundWidth / 2, groundHeight - 4, groundWidth / 2, 1, bodyDef, b2Body, b2FixtureDef, b2PolygonShape); // Top boundary
    createWall(groundWidth / 2, 0, groundWidth / 2, 1, bodyDef, b2Body, b2FixtureDef, b2PolygonShape); // Bottom boundary
    createWall(0, groundHeight / 2, 1, groundHeight / 2, bodyDef, b2Body, b2FixtureDef, b2PolygonShape); // Left boundary
    createWall(groundWidth - 4, groundHeight / 2, 1, groundHeight / 2, bodyDef, b2Body, b2FixtureDef, b2PolygonShape); // Right boundary

    //create some objects
    bodyDef.type = b2Body.b2_dynamicBody;
    for(var i = 100; i--;) {
        createCircle(fixDef, bodyDef, b2Vec2, b2CircleShape, groundWidth, groundHeight, 25);
        createPolygon(fixDef, bodyDef, b2Vec2, b2PolygonShape, groundWidth, groundHeight, 5, 25);
    }

    window.setInterval(update, 1000 / 60);
};

function createWall(x, y, width, height, bodyDef, b2Body, b2FixtureDef, b2PolygonShape) {
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    var wall = new b2FixtureDef;
    wall.density = 1.0;
    wall.friction = 0.5;
    wall.restitution = 0.2;
    wall.shape = new b2PolygonShape;
    wall.shape.SetAsBox(width, height);

    world.CreateBody(bodyDef).CreateFixture(wall);
}

function createCircle(fixDef, bodyDef, b2Vec2, b2CircleShape, x, y, size) {
    fixDef.shape = new b2CircleShape (size);
    bodyDef.position.x = Math.random() * (x -40) + 20;
    bodyDef.position.y = Math.random() * (y -40) + 20;

    var objBody = world.CreateBody(bodyDef);
    objBody.CreateFixture(fixDef);
    
    var initialVelocityX = (Math.random() * 100) - 50; // Range: -5 to 5
    var initialVelocityY = (Math.random() * 100) - 50; // Range: -5 to 5
    objBody.SetLinearVelocity(new b2Vec2(initialVelocityX, initialVelocityY));

    var initialAngularVelocity = (Math.random() * 10) - 5; // Range: -5 to 5
    objBody.SetAngularVelocity(initialAngularVelocity);
}

function createPolygon(fixDef, bodyDef, b2Vec2, b2PolygonShape, x, y, n, size) {
    var vertices = [];
    var angle = (Math.PI * 2) / n;

    for (var i = 0; i < n; i++) {
        var vertexX = Math.cos(angle * i) * size;
        var vertexY = Math.sin(angle * i) * size;
        vertices.push(new b2Vec2(vertexX, vertexY));
    }

    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsArray(vertices, n);
    bodyDef.position.x = Math.random() * (x - 40) + 20;
    bodyDef.position.y = Math.random() * (y - 40) + 20;

    var objBody = world.CreateBody(bodyDef);
    objBody.CreateFixture(fixDef);

    var initialVelocityX = (Math.random() * 100) - 50; // 범위: -5에서 5까지
    var initialVelocityY = (Math.random() * 100) - 50; // 범위: -5에서 5까지
    objBody.SetLinearVelocity(new b2Vec2(initialVelocityX, initialVelocityY));

    var initialAngularVelocity = (Math.random() * 10) - 5; // 범위: -5에서 5까지
    objBody.SetAngularVelocity(initialAngularVelocity);
}

function update() {
    world.Step(1 / 60, 10, 10);
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all bodies
    for (var body = world.GetBodyList(); body; body = body.GetNext()) {
        var fixture = body.GetFixtureList();
        if (fixture) { // Only proceed if the body has a fixture
            var shape = fixture.GetShape();
            var type = shape.GetType();

            ctx.save();
            ctx.translate(body.GetPosition().x, body.GetPosition().y);
            ctx.rotate(body.GetAngle());
            
            if (type == Box2D.Collision.Shapes.b2Shape.e_circleShape) {
                // Draw a circle
                ctx.beginPath();
                ctx.arc(0, 0, shape.GetRadius(), 0, 2 * Math.PI);
                ctx.fillStyle = "#FF0000";
                ctx.fill();
            } else if (type == Box2D.Collision.Shapes.b2Shape.e_polygonShape) {
                // Draw a polygon
                var vertices = shape.GetVertices();
                ctx.beginPath();
                ctx.moveTo(vertices[0].x, vertices[0].y);
                for (var i = 1; i < vertices.length; i++) {
                    ctx.lineTo(vertices[i].x, vertices[i].y);
                }
                ctx.closePath();
                ctx.fillStyle = body.GetType() == Box2D.Dynamics.b2Body.b2_staticBody ? "transparent" : "#FFFFFF";
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    world.ClearForces();
};

using Microsoft.EntityFrameworkCore;
using ContactApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure SQLite database context
builder.Services.AddDbContext<ContactDbContext>(options =>
    options.UseSqlite("Data Source=contacts.db"));

// Configure CORS policy
//Cross origin Resource sharing
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin() // Allow any origin for development; adjust for production
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// applying the cors so that we can communicate with the backend through frontend 
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

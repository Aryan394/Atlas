using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Atlas.Api.Entity;

namespace Atlas.Api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<JobApplication> JobApplications => Set<JobApplication>();

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyAuditFields();
        return base.SaveChanges();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUser(modelBuilder);
        ConfigureTransaction(modelBuilder);
        ConfigureJobApplication(modelBuilder);
        ConfigureTodoItem(modelBuilder);
    }

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        ConfigureBaseEntity<User>(modelBuilder, entity =>
        {
            entity.ToTable("users");
            entity.HasIndex(u => u.Email)
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");
            entity.Property(u => u.Email).HasMaxLength(256);
            entity.Property(u => u.PasswordHash).HasMaxLength(512);
        });
    }

    private static void ConfigureTransaction(ModelBuilder modelBuilder)
    {
        ConfigureBaseEntity<Transaction>(modelBuilder, entity =>
        {
            entity.ToTable("transactions");
            entity.Property(t => t.Description).HasMaxLength(200);
            entity.Property(t => t.Category).HasMaxLength(100);
            entity.Property(t => t.Amount).HasPrecision(18, 2);
            entity.Property(t => t.Type).HasConversion<int>();
            entity.HasIndex(t => t.Date);
            entity.HasIndex(t => t.Type);
        });
    }

    private static void ConfigureJobApplication(ModelBuilder modelBuilder)
    {
        ConfigureBaseEntity<JobApplication>(modelBuilder, entity =>
        {
            entity.ToTable("job_applications");
            entity.Property(j => j.CompanyName).HasMaxLength(200);
            entity.Property(j => j.JobUrl).HasMaxLength(2048);
            entity.Property(j => j.Status).HasConversion<string>().HasMaxLength(50);
            entity.HasIndex(j => j.Status);
            entity.HasIndex(j => j.CompanyName);
        });
    }

    private static void ConfigureTodoItem(ModelBuilder modelBuilder)
    {
        ConfigureBaseEntity<TodoItem>(modelBuilder, entity =>
        {
            entity.ToTable("todo_items");
            entity.Property(t => t.Title).HasMaxLength(300);
            entity.Property(t => t.Notes).HasMaxLength(1000);
            entity.HasIndex(t => t.IsCompleted);
            entity.HasIndex(t => t.EndTime);
        });
    }

    private static void ConfigureBaseEntity<TEntity>(
        ModelBuilder modelBuilder,
        Action<EntityTypeBuilder<TEntity>>? configure = null)
        where TEntity : BaseEntity
    {
        var entity = modelBuilder.Entity<TEntity>();

        entity.HasKey(e => e.Id);
        entity.Property(e => e.Id).ValueGeneratedOnAdd();
        entity.Property(e => e.CreationTime).IsRequired();
        entity.Property(e => e.IsDeleted).IsRequired().HasDefaultValue(false);
        entity.HasQueryFilter(e => !e.IsDeleted);

        configure?.Invoke(entity);
    }

    private void ApplyAuditFields()
    {
        var utcNow = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreationTime = utcNow;
                    entry.Entity.IsDeleted = false;
                    break;
                case EntityState.Modified:
                    entry.Entity.LastModificationTime = utcNow;
                    break;
            }
        }
    }
}

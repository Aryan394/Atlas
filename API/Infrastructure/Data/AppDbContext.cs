using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Moneytize.Api.Entity;

namespace Moneytize.Api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Transaction> Transactions => Set<Transaction>();

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
            entity.HasIndex(t => t.Date);
        });
    }

    private static void ConfigureBaseEntity<TEntity>(
        ModelBuilder modelBuilder,
        Action<EntityTypeBuilder<TEntity>>? configure = null)
        where TEntity : BaseEntity
    {
        var entity = modelBuilder.Entity<TEntity>();

        entity.HasKey(e => e.Id);
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

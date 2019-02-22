namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Messages", "IsRead", c => c.Boolean(nullable: false));
            AddColumn("dbo.Messages", "RealTime", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Messages", "RealTime");
            DropColumn("dbo.Messages", "IsRead");
        }
    }
}

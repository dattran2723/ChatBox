namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Messages", "DateRead", c => c.DateTime());
            DropColumn("dbo.Messages", "RealTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Messages", "RealTime", c => c.DateTime());
            DropColumn("dbo.Messages", "DateRead");
        }
    }
}

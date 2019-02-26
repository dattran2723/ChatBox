namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Messages", "RealTime", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Messages", "RealTime", c => c.String());
        }
    }
}

namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updatetablemessage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Messages", "FromConnectionId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Messages", "FromConnectionId");
        }
    }
}

namespace ChatBox.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changetbmessage : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Messages", "DateSend", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Messages", "DateSend", c => c.String());
        }
    }
}

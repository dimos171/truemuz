using System;

namespace truemuz.API.Infrastructure.Configuration
{
    public static class LinkGeneratorConfig
    {
        public static string AadClientId { get; set; }

        public static Uri AadEndpoint { get; set; }

        public static string AadSecret { get; set; }

        public static string AadTenantId { get; set; }

        public static string AccountName { get; set; }

        public static Uri ArmAadAudience { get; set; }

        public static Uri ArmEndpoint { get; set; }

        public static string Region { get; set; }

        public static  string ResourceGroup { get; set; }

        public static string SubscriptionId { get; set; }
    }
}

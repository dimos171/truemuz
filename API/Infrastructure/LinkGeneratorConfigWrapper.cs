using System;

namespace truemuz.API.Infrastructure
{
    public class LinkGeneratorConfigWrapper
    {
        public string AadClientId { get; set; }

        public Uri AadEndpoint { get; set; }

        public string AadSecret { get; set; }

        public string AadTenantId { get; set; }

        public string AccountName { get; set; }

        public Uri ArmAadAudience { get; set; }

        public Uri ArmEndpoint { get; set; }

        public string Region { get; set; }

        public string ResourceGroup { get; set; }

        public string SubscriptionId { get; set; }
    }
}

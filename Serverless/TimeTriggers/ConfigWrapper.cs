using System;
using Microsoft.Extensions.Configuration;

namespace TimeTriggers
{
    public class ConfigWrapper
    {
        public ConfigWrapper(string subcriptionId, string resourceGroup, string accountName, string aadTenantId, 
            string aadClientId, string aadSecret, string armAadAudience, string aadEndpoint, string armEnpoint, string region,
            string waveFormSmoothingRate)
        {
            SubscriptionId = subcriptionId;
            ResourceGroup = resourceGroup;
            AccountName = accountName;
            AadTenantId = aadTenantId;
            AadClientId = aadClientId;
            AadSecret = aadSecret;
            ArmAadAudience = new Uri(armAadAudience);
            AadEndpoint = new Uri(aadEndpoint);
            ArmEndpoint = new Uri(armEnpoint);
            Region = region;
            WaveFormSmoothingRate = Convert.ToDouble(waveFormSmoothingRate);
        }

        public string SubscriptionId { get; }

        public string ResourceGroup { get; }

        public string AccountName { get; }

        public string AadTenantId { get; }

        public string AadClientId { get; }

        public string AadSecret { get; }

        public Uri ArmAadAudience { get; }

        public Uri AadEndpoint { get; }

        public Uri ArmEndpoint { get; }

        public string Region { get; }

        public double WaveFormSmoothingRate { get; }
    }
}

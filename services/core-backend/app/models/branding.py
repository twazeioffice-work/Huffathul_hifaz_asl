class BrandingModelMock:
    """
    DDL Schema Mock for Enterprise Custom Branding and Domains.
    """
    def __init__(self, tenant_id: str, custom_domain: str, primary_color: str, logo_url: str):
        self.tenant_id = tenant_id
        self.custom_domain = custom_domain
        self.primary_color = primary_color
        self.logo_url = logo_url
        self.dns_verified = False

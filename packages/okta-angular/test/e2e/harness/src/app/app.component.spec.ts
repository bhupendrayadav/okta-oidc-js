import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';

import {
  OktaAuthGuard,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaLoginRedirectComponent
} from '@okta/okta-angular';

describe('Unit Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const config = {
      issuer: environment.ISSUER,
      redirectUri: environment.REDIRECT_URI,
      clientId: environment.CLIENT_ID,
      scope: 'email',
      responseType: 'id_token'
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'foo', redirectTo: '/foo' }]),
        OktaAuthModule.initAuth(config)
      ],
      declarations: [
        AppComponent
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should instantiate the OktaAuth object', async(() => {
    const config = component.oktaAuth.getOktaConfig();
    expect(config.issuer).toBe(environment.ISSUER);
    expect(config.redirectUri).toBe(environment.REDIRECT_URI);
    expect(config.clientId).toBe(environment.CLIENT_ID);
    expect(config.scope).toBe('email openid');
    expect(config.responseType).toBe('id_token');
  }));

  it('can retrieve an accessToken from the tokenManager', async (done) => {
    const mockAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXIiOj' +
                            'EsImp0aSI6IkFULnJ2Ym5TNGlXdTJhRE5jYTNid1RmMEg5Z' +
                            'VdjV2xsS1FlaU5ZX1ZlSW1NWkEiLCJpc3MiOiJodHRwczov' +
                            'L2xib3lldHRlLnRyZXhjbG91ZC5jb20vYXMvb3JzMXJnM3p' +
                            '5YzhtdlZUSk8wZzciLCJhdWQiOiJodHRwczovL2xib3lldH' +
                            'RlLnRyZXhjbG91ZC5jb20vYXMvb3JzMXJnM3p5YzhtdlZUS' +
                            'k8wZzciLCJzdWIiOiIwMHUxcGNsYTVxWUlSRURMV0NRViIs' +
                            'ImlhdCI6MTQ2ODQ2NzY0NywiZXhwIjoxNDY4NDcxMjQ3LCJ' +
                            'jaWQiOiJQZjBhaWZyaFladTF2MFAxYkZGeiIsInVpZCI6Ij' +
                            'AwdTFwY2xhNXFZSVJFRExXQ1FWIiwic2NwIjpbIm9wZW5pZ' +
                            'CIsImVtYWlsIl19.ziKfS8IjSdOdTHCZllTDnLFdE96U9bS' +
                            'IsJzI0MQ0zlnM2QiiA7nvS54k6Xy78ebnkJvmeMCctjXVKk' +
                            'JOEhR6vs11qVmIgbwZ4--MqUIRU3WoFEsr0muLl039QrUa1' +
                            'EQ9-Ua9rPOMaO0pFC6h2lfB_HfzGifXATKsN-wLdxk6cgA';
    const standardAccessTokenParsed = {
      accessToken: mockAccessToken,
      expiresAt: new Date().getTime() + 100, // ensure token is active
      scopes: ['openid', 'email'],
      tokenType: 'Bearer',
      authorizeUrl: environment.ISSUER + '/oauth2/v1/authorize',
      userinfoUrl: environment.ISSUER + '/oauth2/v1/userinfo'
    };
    // Store the token
    localStorage.setItem(
      'okta-token-storage',
      JSON.stringify({'accessToken': standardAccessTokenParsed}),
    );
    const accessToken = await component.oktaAuth.getAccessToken();
    expect(accessToken).toBe(mockAccessToken);
    done();
  });
});

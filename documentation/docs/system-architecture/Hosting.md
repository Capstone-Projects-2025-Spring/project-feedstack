---
sidebar_position: 10
---
# Hosting for Feedstack
Step 1: Authenticate with Fly.io
--------------------------------

```
flyctl auth login
```

* * * * *

Step 2: Initialize the Application
----------------------------------

If deploying for the first time, initialize the app from the project root:

```
flyctl launch
```

This will:

-   Generate a `fly.toml` configuration file

-   Register the application name

-   Allow you to choose a deployment region

If already initialized, this step can be skipped.

* * * * *

Step 3: Configure Environment Variables
---------------------------------------

Feedstack requires several secrets to function. These are set securely using the Fly.io CLI:

```
flyctl secrets set\
  OPENAI_API_KEY=your_openai_key\
  DJANGO_SECRET_KEY=your_django_secret_key\
  FRONTEND_URL=https://feedstack.fly.dev\
  ALLOWED_HOSTS=.fly.dev
```

* * * * *

Step 4: Deploy the Application
------------------------------

To build and deploy the containerized application:

```
flyctl deploy
```

This command will:

-   Build the Docker image using the provided `Dockerfile`

-   Upload it to Fly.io

-   Deploy it to the specified region

-   Expose it at a live HTTPS URL

* * * * *

Step 5: Monitor Logs
--------------------

You can monitor the live output of your application using:

```
flyctl logs
```

This is useful for real-time debugging and validation.

* * * * *

Step 6: `fly.toml` Configuration (Example)
------------------------------------------

The `fly.toml` file defines the Fly.io app settings. Here is a sample:

```
app = "feedstack"

[build]
  dockerfile = "Dockerfile"

[env]
  DJANGO_SETTINGS_MODULE = "feedstack.settings.production"
  PYTHONUNBUFFERED = "1"

[[services]]
  internal_port = 8000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

* * * * *

Step 7: Redeployment
--------------------

After making updates to the codebase (either backend or frontend), re-deploy the application with:

```
flyctl deploy
```

This rebuilds the image and pushes it live with zero downtime.

* * * * *

# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.jdk17  # Java for React Native Android
    pkgs.yarn
    pkgs.git
    pkgs.wget
    pkgs.curl
    pkgs.python3
  ];

  # Sets environment variables in the workspace
  env = {
    # React Native environment variables
    ANDROID_HOME = "$HOME/Android/Sdk";
    JAVA_HOME = "${pkgs.jdk17}";
    # For React Native
    NODE_ENV = "development";
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "ms-vscode.vscode-react-native"
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
      "ms-vscode.vscode-typescript-next"
      "firebase.firebase-vscode"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # React Native Metro bundler preview
        metro = {
          command = ["npm" "start"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
        # Web preview for React Native web
        web = {
          command = ["npm" "run" "web"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Install Node.js dependencies
        npm-install = "npm install";
        # Install React Native CLI globally
        install-rn-cli = "npm install -g react-native-cli @react-native-community/cli";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Start Metro bundler in background for React Native
        start-metro = "npm start &";
        # Display welcome message with Luna setup instructions
        welcome = "echo '🚀 Luna React Native Project Ready! Run: npx react-native run-android'";
      };
    };
  };
}
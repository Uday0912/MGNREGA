# 🗄️ MongoDB Atlas Setup Guide

## Why MongoDB Atlas?

Vercel serverless functions run in the cloud, so you need a cloud-hosted MongoDB database. MongoDB Atlas offers a **free tier** that's perfect for this project.

## 📋 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with Google, GitHub, or email

### Step 2: Create a Free Cluster

1. **Choose a Cloud Provider:**
   - Select **AWS**, **Google Cloud**, or **Azure**
   - Choose the **FREE tier** (M0 Sandbox)

2. **Select Region:**
   - Choose a region close to you (e.g., `Mumbai` for India)
   - Or closest to Vercel's servers

3. **Cluster Name:**
   - Name it: `mgnrega-cluster` (or your preferred name)

4. Click **"Create Cluster"**
   - Wait 2-3 minutes for cluster creation

### Step 3: Create Database User

1. In the **Security** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. **Authentication Method:** Password
4. **Username:** `mgnrega_user` (or your choice)
5. **Password:** 
   - Click **"Autogenerate Secure Password"** (recommended)
   - **OR** create your own strong password
   - **⚠️ SAVE THIS PASSWORD** - you won't see it again!
6. **Database User Privileges:** Read and write to any database
7. Click **"Add User"**

### Step 4: Configure Network Access

1. In the **Security** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** 
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ For production, you can restrict to Vercel IPs later
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. **Driver:** Node.js
4. **Version:** 5.5 or later
5. **Copy the connection string**

It will look like:
```
mongodb+srv://mgnrega_user:<password>@mgnrega-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Complete Connection String

Replace `<password>` with your actual password:

```
mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/mgnrega_data?retryWrites=true&w=majority
```

**Important additions:**
- Add database name: `/mgnrega_data` (before the `?`)
- Keep the parameters: `?retryWrites=true&w=majority`

### Step 7: Install MongoDB Shell (mongosh) for Testing

**On Windows:**

1. Download MongoDB Shell from [https://www.mongodb.com/try/download/shell](https://www.mongodb.com/try/download/shell)
2. Select: **Windows**, **msi installer**
3. Run the installer and follow the setup wizard
4. Add `mongosh` to your PATH (installer usually does this automatically)

**On macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongosh
```

**On Linux:**
```bash
# Download and install
curl -sSL https://downloads.mongodb.com/compass/mongosh-2.0.1-linux-x64.tgz -o mongosh.tgz
tar -xzf mongosh.tgz
sudo mv mongosh-2.0.1-linux-x64/bin/* /usr/local/bin/
```

### Step 8: Test Connection with mongosh

Test your connection to MongoDB Atlas:

```bash
# With password in command:
mongosh "mongodb+srv://cluster0.akg05hj.mongodb.net/" --apiVersion 1 --username Eren_db_user --password Uday_0912

# Or with password inline:
mongosh "mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/" --apiVersion 1

# Or it will prompt for password:
mongosh "mongodb+srv://cluster0.akg05hj.mongodb.net/" --apiVersion 1 --username Eren_db_user
```

If connection is successful, you'll see:
```
Current Mongosh Log ID: [some-id]
Connecting to: mongodb+srv://cluster0.akg05hj.mongodb.net/
Using MongoDB: [version]
Using Mongosh: [version]
[
  {
    $currentOp: null,
    isMaster: [Object],
    ...
  }
]
Atlas cluster0 [primary] test>
```

### Step 9: Test Connection with Node.js (Optional)

You can also test the connection using Node.js:

```bash
# In your backend directory
cd backend

# Create/update .env file
echo "MONGODB_URI=mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/mgnrega_data?retryWrites=true&w=majority" > .env

# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(e => console.error(e))"
```

### Step 10: Use in Vercel

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Add: `MONGODB_URI`
   - Value: Your complete connection string (from Step 6)
   - Select: Production, Preview, Development
   - Click "Add"

2. **Redeploy** your project

## ✅ Example Connection Strings

**For mongosh connection (with password):**
```
mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/
```

**For Node.js/Mongoose (with database name):**
```
mongodb+srv://Eren_db_user:Uday_0912@cluster0.akg05hj.mongodb.net/mgnrega_data?retryWrites=true&w=majority
```

**mongosh command example:**
```bash
mongosh "mongodb+srv://cluster0.akg05hj.mongodb.net/" --apiVersion 1 --username Eren_db_user --password Uday_0912
```

**Generic template (replace with your credentials):**
```
mongodb+srv://mgnrega_user:MySecurePassword123@mgnrega-cluster.abc123.mongodb.net/mgnrega_data?retryWrites=true&w=majority
```

## 🔒 Security Best Practices

1. **Strong Password:** Use a complex password (12+ characters, mixed case, numbers, symbols)

2. **IP Whitelist:** For production, you can restrict IP access:
   - Get Vercel's IP ranges from their docs
   - Add only those IPs to Network Access

3. **Environment Variables:** Never commit connection strings to Git

4. **Database User:** Use a dedicated user (not admin) with minimal required permissions

## 🆘 Troubleshooting

### Connection Timeout

- **Check Network Access:** Ensure `0.0.0.0/0` is added
- **Verify Password:** Make sure password has no special characters that need URL encoding
- **Check Connection String:** Ensure it's complete and correct

### Authentication Failed

- **Verify Username/Password:** Check if they match
- **Check Database User:** Ensure user has read/write permissions
- **URL Encode Password:** If password has special characters, URL encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - etc.

### Database Not Found

- The database (`mgnrega_data`) will be created automatically when you first write data
- No need to create it manually in Atlas

## 📊 Free Tier Limits

- **Storage:** 512 MB (plenty for this project)
- **RAM:** Shared
- **Bandwidth:** Limited but sufficient for most apps
- **Perfect for:** Development, small production apps

## 🎯 Next Steps

1. ✅ Create Atlas account
2. ✅ Create cluster
3. ✅ Set up database user
4. ✅ Get connection string
5. ✅ Add to Vercel environment variables
6. ✅ Deploy!

---

**Need help?** 
- MongoDB Atlas [Documentation](https://docs.atlas.mongodb.com/)
- MongoDB [Community Forum](https://www.mongodb.com/community/forums/)


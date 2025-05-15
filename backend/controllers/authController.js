

const login = (req, res) => {
    const user = req.user;
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        uid: user.uid
      }
    });
}

const currUser = (req, res) => {
  const user = req.user;
    res.json({
      message: 'Fetched current user',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        uid: user.uid
      }
    });
}

export {
    login,
    currUser
}
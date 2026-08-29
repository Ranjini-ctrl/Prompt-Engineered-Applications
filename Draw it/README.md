# 🎨 Draw It - Creative Drawing App for Kids

A beautiful, responsive web application designed specifically for children aged 5-15 years. Draw It provides a fun and engaging platform for kids to express their creativity through free drawing and coloring activities.

## Demo

https://github.com/user-attachments/assets/d4efcee6-c23b-46e8-ba88-b3447ba4eb77

## ✨ Features

### 🎨 Free Drawing
- Multiple drawing tools (Pen, Brush, Pencil, Marker, Rainbow Pen, Eraser)
- Adjustable brush size and opacity
- Color picker with quick color palette
- Undo/Redo functionality
- Clear canvas option
- Save and download drawings
- Auto-save every 10 seconds
- Fullscreen mode
- Keyboard shortcuts support

### 🖍️ Coloring Book
- Pre-made templates across 6 categories:
  - 🍎 Fruits (Apple, Orange, Banana, Grapes, Mango, Strawberry)
  - 🐱 Animals (Cat, Dog, Lion, Elephant, Rabbit, Bird)
  - 🚗 Objects (Car, House, Rocket, Train, Airplane, Boat)
  - 🌹 Flowers (Rose, Sunflower, Tulip, Daisy, Hibiscus, Blossom)
  - 👦 Kids (Boy, Girl, Baby, Princess, Superhero, Fairy)
  - 🎄 Festivals (Christmas, Diwali, Halloween, Easter, Birthday, Fireworks)
- Brush and fill bucket tools
- Color any template with ease
- Save colored artwork

### 🖼️ My Gallery
- View all saved artwork
- Beautiful card-based layout
- Download individual drawings
- Delete unwanted drawings
- View creation dates
- Animated gallery items

### 👤 User Profile
- Customizable avatars (Boy, Girl, Cat, Rabbit, Fox, Panda)
- View total drawings count
- Track favorite colors
- Edit profile information
- Settings panel:
  - Dark/Light mode toggle
  - Music on/off
  - Sound effects on/off
  - Auto-save toggle

### 🔐 Authentication
- User registration with email
- Secure login system
- Remember me functionality
- Avatar selection during signup
- Confetti animation on successful signup

## 🎨 Design Features

### Claymorphism Design
- Soft, rounded cards with 3D depth
- Beautiful shadows and highlights
- Smooth transitions and animations
- Child-friendly color palette:
  - Sky Blue (#70D6FF)
  - Pink (#FF70A6)
  - Yellow (#FFD670)
  - Green (#7AE582)
  - Purple (#A685FF)

### Animations
- Floating clouds
- Flying birds and butterflies
- Rising balloons
- Twinkling stars
- Rotating sun
- Rainbow effects
- Animated crayons
- Page transitions
- Loading screen with animated pencil
- Confetti on signup
- Bounce and hover effects

### Custom Cursor
- Colorful paint brush cursor on interactive elements

## 💾 Local Storage

All data is stored locally in the browser using LocalStorage:
- User accounts and credentials
- User avatars and preferences
- All drawings and artwork
- Coloring pages
- Recent colors
- Favorite colors
- Settings preferences

**No backend required!** Everything runs completely client-side.

## 🚀 Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No installation or build process required!

### Usage

1. **Landing Page**: Click "Sign Up" to create a new account
2. **Sign Up**: Choose a username, email, password, and avatar
3. **Home Page**: Access all features from the main menu
4. **Free Drawing**: Create original artwork with various tools
5. **Coloring Book**: Choose from templates and color them
6. **Gallery**: View, download, or delete saved artwork
7. **Profile**: Customize your account and settings

## 🎯 Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

Fully responsive and optimized for:
- 💻 Desktop computers (1200px+)
- 💻 Laptops (768px - 1199px)
- 📱 Tablets (480px - 767px)
- 📱 Mobile phones (320px - 479px)

Works in both portrait and landscape orientations!

## ⌨️ Keyboard Shortcuts

### Drawing Page
- `Ctrl/Cmd + S` - Save drawing
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Shift + Z` - Redo
- `E` - Select Eraser tool
- `B` - Select Brush tool
- `P` - Select Pen tool
- `Esc` - Close modals

## 📁 Project Structure

```
Draw-It/
├── index.html              # Landing page
├── login.html             # Login page
├── signup.html            # Sign up page
├── home.html              # Home dashboard
├── drawing.html           # Free drawing page
├── coloring.html          # Coloring book page
├── gallery.html           # Gallery page
├── profile.html           # User profile page
├── css/
│   ├── style.css          # Main styles
│   ├── animations.css     # Animation styles
│   ├── claymorphism.css   # Claymorphism effects
│   └── responsive.css     # Responsive styles
├── js/
│   ├── utils.js           # Utility functions
│   ├── storage.js         # LocalStorage management
│   ├── auth.js            # Authentication
│   ├── home.js            # Home page logic
│   ├── drawing.js         # Drawing functionality
│   ├── coloring.js        # Coloring functionality
│   ├── gallery.js         # Gallery management
│   └── profile.js         # Profile management
└── README.md              # This file
```

## 🎨 Color Palette

```css
--sky-blue: #70D6FF
--pink: #FF70A6
--yellow: #FFD670
--green: #7AE582
--purple: #A685FF
--white: #FFFFFF
```

## 🔧 Technologies Used

- **HTML5** - Structure and Canvas API
- **CSS3** - Styling with Flexbox and Grid
- **Vanilla JavaScript** - No frameworks or libraries
- **LocalStorage API** - Data persistence
- **Canvas API** - Drawing functionality

## 🌟 Key Features

✅ No backend required
✅ Fully client-side application
✅ Works offline after first load
✅ Beautiful claymorphism design
✅ Smooth animations everywhere
✅ Touch device support
✅ Keyboard shortcuts
✅ Auto-save functionality
✅ Undo/Redo support
✅ Export as PNG
✅ Dark mode support
✅ Mobile-friendly
✅ Child-safe interface

## 🎯 Target Audience

Children aged **5 to 15 years** who love:
- Drawing and coloring
- Creative expression
- Digital art
- Fun and engaging interfaces
- Colorful designs

## 🛡️ Privacy & Security

- All data stored locally in browser
- No data sent to external servers
- No tracking or analytics
- Safe for children
- Parents have full control

## 🚀 Future Enhancements

- Share drawings with friends
- Print functionality
- More templates and categories
- Stickers and stamps
- Text tool
- Shape tools (circle, square, triangle)
- Background patterns
- Import images
- Animation creator
- Drawing challenges
- Achievement badges

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Code Quality
- Clean, commented code
- Modular JavaScript
- Semantic HTML
- BEM-like CSS naming
- Mobile-first approach

### Performance
- Optimized animations
- Efficient canvas rendering
- Debounced resize handlers
- Lazy loading where applicable

## 🎉 Acknowledgments

- Font families: Fredoka, Baloo 2, Poppins from Google Fonts
- Emoji icons for avatars and templates
- Inspired by kids' drawing apps and educational games

## 📞 Support

For questions or issues, please check:
1. Browser console for errors
2. LocalStorage limits (typically 5-10MB)
3. Browser compatibility
4. Enable JavaScript in browser

---

**Made with 💖 for creative kids everywhere!**

🎨 **Draw It** - *Imagine • Draw • Color • Create*

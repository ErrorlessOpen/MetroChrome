using System;
using Windows.UI.Xaml.Controls;

namespace MetroChrome
{
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            BrowserView.Navigate(new Uri("https://www.google.com"));
        }
    }
}
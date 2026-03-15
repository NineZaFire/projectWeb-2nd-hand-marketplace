import React from "react";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { MyShopPage } from "../pages/MyShopPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { SearchProductsPage } from "../pages/SearchProductsPage";
import { AuthService } from "../services/AuthService";

export default class App extends React.Component {
  // Dev mode (เข้า home ได้เลยเพื่อดู UI)
  state = {
    route: import.meta.env.DEV ? "home" : "login",
    user: import.meta.env.DEV ? { name: "Preview User" } : null,
    selectedProduct: null,
    searchKeyword: "",
    booting: true,
  };

  auth = AuthService.instance();

  async componentDidMount() {
    try {
      const me = await this.auth.me?.();
      if (me?.user) this.setState({ user: me.user, route: "home" });
    } catch {
      // ignore
    } finally {
      this.setState({ booting: false });
    }
  }

  go = (route) => this.setState({ route });

  onLoggedIn = (user) => this.setState({ user, route: "home" });

  onRegistered = () => this.setState({ route: "login" });

  // ✅ HomePage เรียกกลับมาเมื่อแก้โปรไฟล์สำเร็จ
  onUpdatedUser = (user) => this.setState({ user });
  onGoMyShop = () => this.setState({ route: "myshop" });
  onBackHome = () => this.setState({ route: "home", selectedProduct: null });
  onOpenProduct = (product) => this.setState({ route: "product", selectedProduct: product ?? null });
  onOpenSearch = (keyword) => this.setState({ route: "search", searchKeyword: keyword ?? "" });

  onLogout = async () => {
    try {
      await this.auth.logout?.();
    } finally {
      this.setState({ user: null, route: "login" });
    }
  };

  render() {
    const { route, user, selectedProduct, searchKeyword, booting } = this.state;
    if (booting) return null;

    // guard
    if (route === "home" && !user) {
      return (
        <LoginPage
          onGoRegister={() => this.go("register")}
          onLoggedIn={this.onLoggedIn}
        />
      );
    }

    if (route === "login") {
      return (
        <LoginPage
          onGoRegister={() => this.go("register")}
          onLoggedIn={this.onLoggedIn}
        />
      );
    }

    if (route === "register") {
      return (
        <RegisterPage
          onGoLogin={() => this.go("login")}
          onRegistered={this.onRegistered}
        />
      );
    }

    if (route === "myshop") {
      return <MyShopPage user={user} onBack={this.onBackHome} />;
    }

    if (route === "product") {
      return <ProductDetailPage product={selectedProduct} onBack={this.onBackHome} />;
    }

    if (route === "search") {
      return (
        <SearchProductsPage
          initialKeyword={searchKeyword}
          onBack={this.onBackHome}
          onGoHome={this.onBackHome}
          onOpenProduct={this.onOpenProduct}
        />
      );
    }

    return (
      <HomePage
        user={user}
        onLogout={this.onLogout}
        onPickCategory={(c) => console.log("pick category:", c)}
        onSearch={(q) => console.log("search:", q)}
        onCart={() => console.log("cart")}
        onToggleMenu={() => console.log("menu")}
        onUpdatedUser={this.onUpdatedUser} // ✅ เพิ่ม
        onGoMyShop={this.onGoMyShop}
        onGoHome={this.onBackHome}
        onOpenProduct={this.onOpenProduct}
        onSubmitSearch={this.onOpenSearch}
      />
    );
  }
}


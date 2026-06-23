source "https://rubygems.org"

# Jekyll moderno (compatible con Ruby 3.x y 4.x).
# Se usa directamente en lugar de github-pages para poder controlar la versión.
# El despliegue en GitHub Pages se realiza mediante GitHub Actions, que permite
# cualquier versión de Jekyll.
gem "jekyll", "~> 4.3"

# Plugins de Jekyll
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Seguridad: escaneo de vulnerabilidades en dependencias
# Ejecutar: bundle exec bundler-audit --update
group :development, :test do
  gem "bundler-audit", require: false
  gem "html-proofer", require: false
end

# Dependencias de plataforma
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Servidor local para Ruby 3+
gem "webrick", "~> 1.8"

# Watcher de archivos para Windows (version 0.2.0 es compatible con Ruby 4.x)
gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]

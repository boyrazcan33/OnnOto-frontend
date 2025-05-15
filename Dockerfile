FROM nginx:alpine

# Copy pre-built frontend files
COPY dist/ /usr/share/nginx/html/

# Expose port
EXPOSE 8080

# Default command to start nginx
CMD ["nginx", "-g", "daemon off;"]
provider "aws" {
    version = "~> 1.5"
    region = "eu-central-1"
}

provider "archive" {
    version = "~> 1.0"
}

terraform {
    backend "s3" {
        bucket = "telepath-terraform"
        key = "telepath/terraform.tfstate"
        region = "eu-central-1"
    }
}

data "archive_file" "telepath-queuing-service" {
    type = "zip"
    source_dir = "${path.module}"
    output_path = "${path.module}/.terraform-build/telepath-queuing-service.zip"
}

resource "aws_s3_bucket" "telepath-source" {
    bucket = "telepath-source"
}

resource "aws_s3_bucket_object" "source" {
    bucket = "${aws_s3_bucket.telepath-source.id}"
    key = "telepath-queuing-service.zip"
    source = "${path.module}/build/telepath-queuing-service.zip"
}

resource "aws_elastic_beanstalk_application" "telepath-queuing-service" {
    name = "telepath-queuing-service"
}

resource "aws_elastic_beanstalk_application_version" "telepath-queuing-service" {
    name = "telepath-queuing-service-latest"
    application = "${aws_elastic_beanstalk_application.telepath-queuing-service.name}"
    bucket = "${aws_s3_bucket.telepath-source.id}"
    key = "${aws_s3_bucket_object.source.key}"
}

resource "aws_elastic_beanstalk_environment" "telepath" {
    name = "telepath"
    application = "${aws_elastic_beanstalk_application.telepath-queuing-service.name}"
    version_label = "${aws_elastic_beanstalk_application_version.telepath-queuing-service.name}"
    solution_stack_name = "64bit Amazon Linux 2017.09 v4.4.0 running Node.js"

    setting {
        namespace = "aws:autoscaling:launchconfiguration"
        name = "IamInstanceProfile"
        value = "aws-elasticbeanstalk-ec2-role"
    }

    setting {
        namespace = "aws:elb:listener:443"
        name = "SSLCertificateId"
        value = "${data.aws_acm_certificate.cogito.arn}"
    }

    setting {
        namespace = "aws:elb:listener:443"
        name = "ListenerProtocol"
        value = "HTTPS"
    }

    setting {
        namespace = "aws:elb:listener:443"
        name = "InstancePort"
        value = "3000"
    }

    setting {
        namespace = "aws:elasticbeanstalk:container:nodejs"
        name = "NodeCommand"
        value = "npm start"
    }

    setting {
        namespace = "aws:elasticbeanstalk:container:nodejs"
        name = "NodeVersion"
        value = "8.8.1"
    }
}

data "aws_acm_certificate" "cogito" {
    domain = "*.cogito.mobi"
}

data "aws_route53_zone" "cogito" {
    name = "cogito.mobi."
}

resource "aws_route53_record" "telepath" {
    zone_id = "${data.aws_route53_zone.cogito.zone_id}"
    name = "telepath.cogito.mobi."
    type = "CNAME"
    ttl = "300"
    records = [ "${aws_elastic_beanstalk_environment.telepath.cname}" ]
}
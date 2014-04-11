
xpi:
	cfx xpi --force-mobile

mobile-install: xpi
	adb push prettify-paragraphs.xpi /mnt/sdcard/

mobile-test:
	cfx run -a fennec-on-device -b /home/fredz/bin/adb --mobile-app firefox_beta --force-mobile

import mraa

def video_routine():
    print 'motion detected!'

pir = mraa.Gpio(8)
pir.dir(mraa.DIR_IN)

while True: # event loop
    # read PIR inputs
    pir_val = pir.read()
    if pir_val:
        # enter video loop
        video_routine()
